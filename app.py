from flask import Flask, render_template, request, abort
from config import Config
from models import db, ExperimentData
from urllib.parse import urlparse
from werkzeug.datastructures import ImmutableMultiDict
import json
import random
import os
import warnings
import copy

with open('experiments.json', 'r') as jfl:
    EXPERIMENT_INFO = json.load(jfl)
        
if 'backend' in EXPERIMENT_INFO:
    raise Exception('Cannot have an experiment route called "backend"')

""" Initialize the experiment """
app = Flask(__name__)
app.config.from_object(Config)
if app.config['SQLALCHEMY_DATABASE_URI'] is None:
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(app.instance_path, 'app.db')}"

try:
    os.makedirs(app.instance_path)
except OSError:
    pass

@app.context_processor
def inject_global_variable():
    return {'admin_email': app.config['ADMIN_EMAIL']}

db.init_app(app)


""" Add backend function calls """
import backend
app.register_blueprint(backend.bp)


""" Set up code to run the experiment """
def experiment(exp_url, req_dict, uses_prolific=False, debug=False):
    exp = EXPERIMENT_INFO.get(exp_url)
    if req_dict is None and not debug:
        if debug:
            print("Nothing posted to the experiment")
        abort(500)
    if exp:
        # Set up data from the experiment
        e_name = exp.get('exp_internal_name')
        if e_name is None:
            if debug:
                e_name = "NO_NAMED_EXPERIMENT"
                warnings.warn("No exp_internal_name provided for the experiment -- fix_for_production")
            else:
                abort(500)
        e_script = exp.get('exp_script')
        if e_script is None:
            if debug:
                print("Error: no experimental script given for experiment " + e_name)
            abort(500)
        e_script_loc = os.path.join(app.static_folder, 'js', e_script + '.js')
        if not os.path.exists(e_script_loc):
            if debug:
                print("Error: no experimental script found for experiment " + e_name)
            abort(404)
        
        e_html = exp.get('exp_html', None)
        if e_html is not None:
            e_html_loc = os.path.join(app.template_folder, 'experiment_html', e_html + '.html')
            if not os.path.exists(e_html_loc):
                if debug:
                    print("Error: no experimental html found for experiment " + e_name)
                abort(404)
                
        num_cond = exp.get('num_conditions', 1)
        num_counter = exp.get('num_counterbalance', 1)
        
        # Set up the user data
        id = req_dict.get('ID')
        if debug and id != 'DEBUG':
            warnings.warn('ID passed to experiment can only be DEBUG in debug mode')
            id = 'DEBUG'
        # Handle where it came from for end processing
        referer = req_dict.get('referer')
        if referer is None:
            if uses_prolific:
                referer = "prolific"
            else:
                referer = "web"
                
        ref_add_dat = {}
        callback = None
        # Handle Prolific default settings
        if referer == "prolific":
            id = id or req_dict.get('PROLIFIC_PID')
            pr_study = req_dict.get('STUDY_ID')
            if pr_study:
                ref_add_dat['study_id'] = pr_study
            pr_session = req_dict.get('SESSION_ID')
            if pr_session:
                ref_add_dat['session_id'] = pr_session
            callback = exp.get('prolific_completion_url')
        elif referer == 'mturk':
            pass # TO DO THIS FOR MTURK DEFAULTS LATER
        
        
        condition = req_dict.get('condition',
                                          random.randrange(0, num_cond))
        counterbalance = req_dict.get('counterbalance',
                                               random.randrange(0, num_counter))
                
        
        # Check if this user exists
        existing_record = backend.get_record(id)

        if existing_record:
            if debug:
                # In the case of debugging, we overwrite any existing records
                warnings.warn("Due to debugging, we overwrite a record with SubjectID " + id)
                db.session.delete(existing_record)
                db.session.commit()
            else:
                return render_template('existing_id.html')
        
        user = ExperimentData(
            SubjectID = id,
            SubjectSource = referer,
            RefererExtraInfo = ref_add_dat,
            Experiment = e_name,
            Condition = condition,
            Counterbalance = counterbalance,
        )
        if callback:
            user.SubjectReturnCode = callback
            
        user.make_random_private_code()
        
        db.session.add(user)
        db.session.commit()
        
        # Remove duplicate plugins (already preloaded)
        plugins = exp.get('plugins', [])
        for p in ['preload', 'html-button-response', 'call-function']:
            pnm = 'plugin-' + p
            if pnm in plugins:
                plugins.remove(pnm)
        
        return render_template('experiment.html',
                               id = id,
                               exp_display_name = exp.get('exp_display_name'),
                               exp_internal_name = e_name,
                               exp_script = e_script,
                               exp_html = e_html,
                               condition = condition,
                               counterbalance = counterbalance,
                               plugins = plugins,
                               additional_scripts = exp.get("additional_scripts", [])
                               )
    else:
        abort(404)

@app.route('/<exp_url>/', methods=('GET', 'POST'))
def experiment_standard(exp_url):
    req_dict = request.form if request.method == 'POST' else request.args
    return experiment(exp_url, req_dict, False, False)
     
@app.route('/<exp_url>/debug/', methods=('GET', 'POST'))
def experiment_debug(exp_url):
    fake_post_data = ImmutableMultiDict([('ID', 'DEBUG'), ('referer', 'debug')])
    return experiment(exp_url, fake_post_data, False, True)

@app.route('/<exp_url>/prolific/', methods=('GET', 'POST'))
def experiment_prolific(exp_url):
    req_dict = request.form if request.method == 'POST' else request.args
    return experiment(exp_url, req_dict, True, False)

@app.route('/endexp/', methods=('GET', 'POST'))
def end_exp():
    if request.method == 'POST':
        id = request.form.get('ID')
        if id is None:
            abort(404)
        rec = db.session.execute(
            db.select(ExperimentData).filter_by(SubjectID = id)
        ).first()[0]
        ## Make the URL for returning to Prolific
        print(rec)
        if rec.SubjectSource == 'prolific' and rec.SubjectReturnCode:
            reflink = rec.SubjectReturnCode
            return render_template('prolific_return.html',
                            id=rec.SubjectID,
                            code=rec.SubjectPrivateCode,
                            reflink=reflink)
        # For anything else, provide the private code to return
        else:
            return render_template('standard_return.html',
                            id=rec.SubjectID,
                            code=rec.SubjectPrivateCode)
        


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5002)
