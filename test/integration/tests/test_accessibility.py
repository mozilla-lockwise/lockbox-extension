"""Test Lockbox for accessibility violations."""

import pytest
from pytest_axe.pytest_axe import run_axe


@pytest.mark.accessibility
def test_login_page_accessibility(login_page):
    """Test login page for accessibility violations."""
    run_axe(login_page, None, None, 'critical')


@pytest.mark.accessibility
def test_home_page_accessibility(home_page):
    """Test home page for accessibility violations."""
    run_axe(home_page, None, None, 'critical')


@pytest.mark.accessibility
def test_account_dropdown_accessibility(fxa_account, login_page):
    """Test home page when logged in for accessibility violations."""
    fxa = fxa_account
    home_page = login_page.sign_in(fxa.email, fxa.password)
    run_axe(home_page, home_page._account_dropdown_locator[1],
            None, 'critical')


@pytest.mark.accessibility
def test_entry_detail_accessibility(home_page):
    """Test the entry detail form for accessibility."""
    entry = home_page.create_new_entry()
    run_axe(home_page, entry._entry_detail_locator[1], None, 'critical')


@pytest.mark.accessibility
def test_entry_list_accessibility(home_page):
    """Test entry list for accessibility."""
    for i in range(0, 10):
        home_page.create_new_entry(
            'My Site Name%s' % i,
            'http://www.website%s.com' % i,
            'user%s' % i,
            'password%s' % i,
            'This is note #%s' % i,
        )
    run_axe(home_page, home_page._entry_list_locator[1])
