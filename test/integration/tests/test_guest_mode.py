"""Tests for guest mode."""


def test_guest_login(login_page):
    """Log into Lockbox."""
    home_page = login_page.click_get_started()
    assert home_page.sign_in_button_is_displayed()


def test_add_entry_as_guest(home_page):
    """Add a new entry."""
    home_page.create_new_entry()
    assert len(home_page.entries) == 1
    assert '(no site name)' in home_page.entries[0].name


def test_delete_entry_as_guest(home_page):
    """Test Deleting an entry."""
    home_page.create_new_entry()
    entry = home_page.entries[0].click()
    entry.delete()
    assert len(home_page.entries) == 0
