"""Tests for lockbox extension."""


def test_guest_login(login_page):
    """Log into Lockbox."""
    home_page = login_page.click_get_started()
    assert home_page.sign_in_button_is_displayed()


def test_add_entry_as_guest(home_page):
    """Add a new entry."""
    home_page.add_entry()
    assert len(home_page.entries) == 1
    assert '(no site name)' in home_page.entries[0].name


def test_delete_entry_as_guest(home_page):
    """Test Deleting an entry."""
    home_page.add_entry()
    entry = home_page.entries[0].click()
    entry.delete()
    assert len(home_page.entries) == 0


def test_sign_in_with_fxa(fxa_account, login_page):
    """Sign in with fxa from the login page."""
    fxa = fxa_account
    home_page = login_page.fxa_sign_in(fxa.email, fxa.password)
    assert home_page.sign_in_button_is_displayed() is False


def test_sign_in_with_fxa_from_home(fxa_account, home_page):
    """Sign in with fxa from 'Home' page."""
    fxa = fxa_account
    home_page.sign_in(fxa.email, fxa.password)
    assert home_page.sign_in_button_is_displayed() is False


def test_door_hanger_interaction(home_page, selenium, base_url):
    """Add an entry and test it shows in the door hanger."""
    home_page.add_entry()
    lists = home_page.door_hanger.find_entrys()
    assert '(no site name)' in lists[0].title
    entry = lists[0].click()
    assert '' in entry.title
