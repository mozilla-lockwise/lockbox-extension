"""Tests for guest mode."""


def test_guest_login(login_page):
    """Log into Lockbox."""
    home_page = login_page.click_get_started()
    assert home_page.sign_in_button_is_displayed()


def test_add_entry_as_guest(home_page):
    """Add a new entry."""
    home_page.create_new_entry("Tuna, Inc.", "https://satuna.org", "tuna4life",
                               "tunafish", "The tuna swim at midnight")

    entry = home_page.entries[0]
    assert len(home_page.entries) == 1
    assert 'Tuna, Inc.' in entry.name
    detail = entry.click()
    detail.edit()
    assert 'https://satuna.org' in detail.site_url
    assert 'tuna4life' in detail.username
    assert 'tunafish' in detail.password
    assert 'The tuna swim at midnight' in detail.note


def test_delete_entry_as_guest(home_page):
    """Test Deleting an entry."""
    home_page.create_new_entry()

    entry = home_page.entries[0].click()
    entry.delete()
    assert len(home_page.entries) == 0
