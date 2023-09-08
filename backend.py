from flask import Blueprint, render_template, request, jsonify
from models import db, ExperimentData
from html import escape, unescape

bp = Blueprint('backend', __name__, url_prefix='/backend')

def get_record(subject_id):
    return ExperimentData.query.filter_by(SubjectID=subject_id).first()

@bp.route('/fetch_consent')
def consent():
    return render_template('consent.html')


@bp.route('/record', methods=('POST','GET'))
def record():
    if request.method == 'POST':
        # Get the record
        
        id = request.json.get('SubjectID')
        if id is None:
            return jsonify({'error': 'No SubjectID provided to POST'}), 400
        rec = get_record(id)
        if not rec:
            return jsonify({'error': 'No SubjectID found in records: ' + id}), 400
        
        # Change the various items passed through
        version = request.json.get('Version')
        if version:
            rec.Version = version
        
        status = request.json.get('Status')
        if status:
            rec.Status = status
        
        data = request.json.get('Data')
        if data:
            rec.Data = escape(data)
            
        events = request.json.get('Events')
        if data:
            rec.Events = escape(events)
        
        db.session.commit()
        return jsonify({'messsage': 'Data uploaded successfully'}), 200
        
    else:
        return jsonify({'error': 'No data posted to record'}), 400