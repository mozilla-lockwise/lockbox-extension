"""Configuration files for pytest."""

import os

import pytest
from fxapom.fxapom import PROD_URL, FxATestAccount

from pages.login import Login


@pytest.fixture
def firefox_options(firefox_options):
    """Configure Firefox preferences."""
    firefox_options.set_preference('extensions.legacy.enabled', True)
    firefox_options.set_preference('ui.popup.disable_autohide', True)
    firefox_options.add_argument('-foreground')
    firefox_options.add_argument('-marionette')
    firefox_options.log.level = 'trace'
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
def login_page(base_url, selenium, hostname):
    """Launch Lockbox."""
    selenium.get('moz-extension://{}/firstrun/index.html'.format(hostname))
    # selenium.switch_to.window(selenium.window_handles[-1])
    return Login(selenium, base_url).wait_for_page_to_load()


@pytest.fixture
def home_page(login_page):
    """Login to Lockbox."""
    return login_page.click_get_started()


@pytest.fixture(scope='session')
def fxa_account(base_url):
    """Create fxa account."""
    return FxATestAccount(PROD_URL)
