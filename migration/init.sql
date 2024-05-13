CREATE TABLE deployment_metadata (
  name    VARCHAR(32) PRIMARY KEY,
  type    VARCHAR(32) CHECK (type IN ('static', 'dynamic')),
  region  VARCHAR(32) CHECK (region in ('us-west-1', 'us-west-2','us-east-1','us-east-2')),
  source  VARCHAR(32) CHECK (source in ('github', 'bitbucket', 'gitlab', 'manual'))
);