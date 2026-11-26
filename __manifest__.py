{
    "name": "Car Repair - Studio Compatibility",
    "version": "16.0.1.0.0",
    "summary": "Open dashboard records with persistent actions for Studio",
    "category": "Services",
    "license": "LGPL-3",
    "depends": ["car_repair_industry", "web_studio"],
    "assets": {
        "web.assets_backend": [
            "car_repair_studio_patch/static/src/js/dashboard_actions.js",
        ],
        "web.qunit_suite_tests": [
            "car_repair_studio_patch/static/tests/dashboard_actions_tests.js",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}