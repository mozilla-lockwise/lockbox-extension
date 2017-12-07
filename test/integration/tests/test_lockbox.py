"""Tests for lockbox extension."""


def test_guest_login(login_page):
    """Log into Lockbox."""
    home_page = login_page.click_get_started()
    assert home_page.sign_in_button_is_displayed()


def test_add_entry_as_guest(home_page):
    """Add a new entry."""
    home_page.add_entry()
    assert len(home_page.entries) == 1
    assert '(No Entry Name)' in home_page.entries[0].name


def test_delete_entry_as_guest(home_page):
    """Test Deleting an entry."""
    home_page.add_entry()
    entry = home_page.entries[0].click()
    entry.delete()
    assert len(home_page.entries) == 0


def test_sign_in_with_fxa(fxa_account, login_page):
    fxa = fxa_account
    home_page = login_page.fxa_sign_in(fxa.email, fxa.password)
    assert home_page.sign_in_button_is_displayed() is False


def test_sign_in_with_fxa_from_home(fxa_account, home_page):
    fxa = fxa_account
    home_page.sign_in(fxa.email, fxa.password)
    assert home_page.sign_in_button_is_displayed() is False


def test_web_ext_interaction(home_page, selenium, base_url):
    home_page
    # ext.wait_for_page_to_load()
    home_page.add_entry()
    lists = home_page.extension.find_stuff()
    assert '(No Entry Name)' in lists[0].title
    entry = lists[0].click()
    assert '' in entry.title
