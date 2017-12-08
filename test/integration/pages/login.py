"""Login page locators and functions."""

from selenium.webdriver.common.by import By

from pages.base import Base
from pages.home import Home
from pages.util.util import munged_class_name


class Login(Base):
    """Set up the login page locators and functions."""

    _confirm_password_locator = (By.NAME, 'confirmPassword')
    _continue_locator = (By.CSS_SELECTOR, 'button.{}'.format(
                         munged_class_name('button')))
    _create_account_locator = (By.ID, 'homepage-upgrade-action-create')
    _get_started_button_locator = (By.CLASS_NAME, '{}'.format(
                                   munged_class_name('primary-theme')))
    _sign_in_button_locator = (By.ID, 'firstrun-using-returning-action')
    _welcome_locator = (By.CLASS_NAME, '{}'.format(
                        munged_class_name('intro')))

    def wait_for_page_to_load(self):
        """Page load wait."""
        self.wait.until(
            lambda s: s.find_element(*self._welcome_locator).is_displayed())
        return self

    def click_get_started(self):
        """Click get started button."""
        self.find_element(*self._get_started_button_locator).click()
        self.selenium.switch_to.window(self.selenium.window_handles[-1])
        return Home(self.selenium, self.base_url).wait_for_page_to_load()
