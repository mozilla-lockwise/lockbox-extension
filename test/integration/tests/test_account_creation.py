"""Test login and new account creation flows"""


def test_sign_in_with_fxa(fxa_account, login_page):
    """Sign in with fxa from the login page."""
    fxa = fxa_account
    home_page = login_page.sign_in(fxa.email, fxa.password)
    assert home_page.sign_in_button_is_displayed() is False


def test_sign_in_with_fxa_from_home(fxa_account, home_page):
    """Sign in with fxa from 'Home' page."""
    fxa = fxa_account
    home_page.sign_in(fxa.email, fxa.password)
    assert home_page.sign_in_button_is_displayed() is False
