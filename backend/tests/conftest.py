"""
Test configuration.

Profiles are written to a temporary directory so running the tests never
modifies the seed profiles committed under backend/data/profiles/.
This must run before any application module is imported.
"""

import os
import sys
import tempfile

os.environ["SKILLNAV_PROFILES_DIR"] = tempfile.mkdtemp(prefix="skillnav_profiles_")

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
