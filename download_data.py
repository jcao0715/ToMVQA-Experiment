import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, JSON, not_
from config import Config
import os
import argparse
import json
from html import unescape


# Find the database
config = Config()

if config.SQLALCHEMY_DATABASE_URI is not None:
    DATABASE_URI = config.SQLALCHEMY_DATABASE_URI
else:
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    DATABASE_URI = f"sqlite:///{os.path.join(instance_path, 'app.db')}"

# Status codes to ignore (since they haven't gotten the the real data generation)
BAD_STATUS = ['on_introduction', 'initializing']

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URI)

# Create a session factory
Session = sessionmaker(bind=engine)

# Define the ExperimentData model (should be identical to the one used in your Flask app)
Base = declarative_base()

class ExperimentData(Base):
    __tablename__ = "experiment_data"
    Index = Column(Integer, primary_key=True, autoincrement=True)
    SubjectID = Column(String(64), unique=True, nullable=False)
    SubjectPrivateCode = Column(String(16))
    SubjectSource = Column(String(16), default="Web")
    SubjectReturnCode = Column(String(16))
    Experiment = Column(String(64), nullable=False)
    Version = Column(String(8), default="1.0")
    Status = Column(String(64), default="intializing")
    Condition = Column(Integer, default=0)
    Counterbalance = Column(Integer, default=0)
    Data = Column(JSON, default={})
    Events = Column(JSON, default={})

# Download the ExperimentData table to a pandas DataFrame
def fetch_experiment_data(subject_id=None, experiment=None, version=None,
                          filter_intro=True, include_debug=False):
    with Session() as session:
        query = session.query(ExperimentData).filter(~ExperimentData.Status.in_(BAD_STATUS))

        if subject_id is not None:
            query = query.filter(ExperimentData.SubjectID == subject_id)
        elif not include_debug:
            query = query.filter(ExperimentData.SubjectID != "DEBUG")

        if experiment is not None:
            query = query.filter(ExperimentData.Experiment == experiment)

        if version is not None:
            query = query.filter(ExperimentData.Version == version)

        data = query.all()
        df = pd.DataFrame([row.__dict__ for row in data]).drop("_sa_instance_state", axis=1, errors='ignore')
        df[['Data', 'Events']] = df[['Data', 'Events']].applymap(unescape)
        
        # Figure out what to filter from the input: just function calls / consent / ignored items or also intro
        if filter_intro:
            target_types = ['fnc_call', 'consent', 'ignore', 'introduction']
        else:
            target_types = ['fnc_call', 'consent', 'ignore']
        
        def remove_intro_trials(data_str):
            data_json = json.loads(data_str)
            if 'trials' in data_json:
                data_json['trials'] = [trial for trial in data_json['trials'] if trial.get('type') not in target_types]
            return json.dumps(data_json)

        df['Data'] = df['Data'].apply(remove_intro_trials)

    return df

def flatten(input_df):
    flattened_rows = []
    all_keys = set()

    for _, row in input_df.iterrows():
        data_json = json.loads(row['Data'])
        trials = data_json.get('trials', [])

        for trial in trials:
            new_row = row.drop(labels=['Data', 'Events']).to_dict()
            new_row.update(trial)
            flattened_rows.append(new_row)

            # Update the set of keys with the keys from the current trial
            all_keys.update(trial.keys())

    # Create a new DataFrame with the union of all keys as columns
    flattened_df = pd.DataFrame(flattened_rows, columns=list(all_keys.union(input_df.columns)))
    flattened_df = flattened_df.drop(['Data', 'Events', 'SubjectPrivateCode', 'SubjectReturnCode'], axis=1)

    return flattened_df

def anonymize(input_df):
    unique_subject_ids = input_df['SubjectID'].unique()
    anonymized_ids = {subject_id: f'S{index:04d}' for index, subject_id in enumerate(unique_subject_ids)}

    anonymized_df = input_df.copy()
    anonymized_df['SubjectID'] = anonymized_df['SubjectID'].replace(anonymized_ids)

    return anonymized_df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch experiment data from the database.")

    parser.add_argument("--subject_id", type=str, default=None, help="Filter by SubjectID.")
    parser.add_argument("--experiment", type=str, default=None, help="Filter by Experiment.")
    parser.add_argument("--version", type=str, default=None, help="Filter by Version.")
    parser.add_argument("output", type=str, help="Output CSV file name.")
    parser.add_argument("--keep_intro", action="store_true", help="Keep introduction trials in the fetched data.")
    parser.add_argument("--flatten", action="store_true", help="Flatten the trials in the Data column.")
    parser.add_argument("--anonymize", action="store_true", help="Anonymize SubjectID column.")
    parser.add_argument("--include_debug", action="store_true", help="Keep user with the DEBUG SubjectID")

    args = parser.parse_args()

    df = fetch_experiment_data(subject_id=args.subject_id, experiment=args.experiment, 
                               version=args.version, filter_intro=not args.keep_intro,
                               include_debug=args.include_debug)

    if args.flatten:
        df = flatten(df)
        
    if args.anonymize:
        df = anonymize(df)

    df.to_csv(args.output, index=False)