document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.menu-arrow-face, .menu-arrow-makeup');
  
    menuItems.forEach(function (menuItem) {
      const submenuId = menuItem.getAttribute('data-submenu-id');
      const submenu = document.getElementById(submenuId);
  
      menuItem.addEventListener('click', function () {
        menuItems.forEach(function (otherMenuItem) {
          if (otherMenuItem !== menuItem) {
            const otherSubmenuId = otherMenuItem.getAttribute('data-submenu-id');
            const otherSubmenu = document.getElementById(otherSubmenuId);
            otherSubmenu.classList.remove('submenu-visible');
            otherMenuItem.classList.remove('submenu-open');
          }
        });
  
        submenu.classList.toggle('submenu-visible');
        menuItem.classList.toggle('submenu-open');
      });
    });
  });