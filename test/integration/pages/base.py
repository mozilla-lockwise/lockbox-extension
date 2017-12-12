"""Base class for common use locators and actions."""

from pypom import Page


class Base(Page):
    """Contain the locators and actions that can be used anywhere."""

    def __init__(self, selenium, base_url, **kwargs):
        """Create the base class object."""
        super(Base, self).__init__(
            selenium, base_url, timeout=10, **kwargs)

    def fxa_sign_in(self, user, password):
        """Sign in to fxa."""
        current_windows = len(self.selenium.window_handles)
        # TODO: Remove this sleep when this gets fixed:
        # https://github.com/mozilla/fxapom/issues/173
        import time
        time.sleep(4)
        from fxapom.pages.sign_in import SignIn
        sign_in = SignIn(self.selenium)
        self.selenium.switch_to.window(self.selenium.window_handles[-1])
        sign_in.email = user
        sign_in.login_password = password
        sign_in.click_sign_in()
        self.wait.until(
            lambda _: len(self.selenium.window_handles) == current_windows)
        time.sleep(1)
        self.selenium.switch_to.window(self.selenium.window_handles[-1])
        time.sleep(1)
        from pages.home import Home
        time.sleep(3)
        return Home(self.selenium, self.base_url).wait_for_page_to_load()
