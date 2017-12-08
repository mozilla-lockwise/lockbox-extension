"""Base class for common use locators and actions."""

from pypom import Page
from selenium.webdriver.common.by import By

from pages.util.util import munged_class_name


class Base(Page):
    """Contain the locators and actions that can be used anywhere."""

    _fxa_sign_in_locator = (By.CSS_SELECTOR, '.{} .{}'.format(
                            munged_class_name('link'), 
                            munged_class_name('puffy-size')))

    def __init__(self, selenium, base_url, **kwargs):
        """Create the base class object."""
        super(Base, self).__init__(
            selenium, base_url, timeout=30, **kwargs)

    def fxa_sign_in(self, user, password):
        """Sign in to fxa."""
        current_windows = len(self.selenium.window_handles)
        els = self.find_elements(*self._fxa_sign_in_locator)
        els[1].click()
        # TODO: Remove this sleep when this gets fixed:
        # https://github.com/mozilla/fxapom/issues/173
        import time
        time.sleep(5)
        from fxapom.pages.sign_in import SignIn
        sign_in = SignIn(self.selenium)
        self.selenium.switch_to.window(self.selenium.window_handles[-1])
        sign_in.email = user
        sign_in.login_password = password
        sign_in.click_sign_in()
        self.wait.until(
            lambda _: len(self.selenium.window_handles) == current_windows)
        self.selenium.switch_to.window(self.selenium.window_handles[-1])
        from pages.home import Home
        return Home(self.selenium, self.base_url).wait_for_page_to_load()
