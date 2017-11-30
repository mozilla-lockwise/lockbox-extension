"""Configuration files for pytest."""

import os

import pytest

from pages.login import Login


@pytest.fixture
def firefox_options(firefox_options):
    """Configure Firefox preferences."""
    firefox_options.set_preference('extensions.legacy.enabled', True)
    firefox_options.add_argument('-foreground')
    return firefox_options


@pytest.fixture(scope='function')
def hostname(pytestconfig, selenium):
    """Install Lockbox."""
    addon = os.path.abspath('addon.xpi')
    _id = selenium.install_addon(addon, temporary=True)
    with selenium.context(selenium.CONTEXT_CHROME):
        hostname = selenium.execute_script("""
var Cu = Components.utils;
const {{WebExtensionPolicy}} = Cu.getGlobalForObject(Cu.import("resource://gre/modules/Extension.jsm", {{}}));
return WebExtensionPolicy.getByID("{}").mozExtensionHostname;""".format(_id))  # noqa
    return hostname


@pytest.fixture
def login_page(selenium, hostname):
    """Launch Lockbox."""
    selenium.get('moz-extension://{}/firstrun/index.html'.format(hostname))
    return Login(selenium).wait_for_page_to_load()


@pytest.fixture
def home_page(login_page):
    """Login to Lockbox."""
    return login_page.login('password')
