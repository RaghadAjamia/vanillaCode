document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      menu = body.querySelector(".menu-toggler"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");
  
    const collapsedSidebarHeight = "70px";
  
    let isMenuOpen = false;

  
    // Desktop toggle
 const setInitialSidebarState = () => {
  sidebar.classList.remove("close");
  sidebar.classList.remove("menu-active");
  sidebar.style.height = "95%";
};

  
    // Mobile menu toggle
    menu.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      sidebar.classList.toggle("menu-active", isMenuOpen);
      sidebar.style.height = isMenuOpen ? `auto` : collapsedSidebarHeight;
      const span = menu.querySelector("span");
      if (span) span.innerText = isMenuOpen ? "close" : "menu";
    });
  
    // Dark/Light mode switch
    modeSwitch.addEventListener("click", () => {
      body.classList.toggle("dark");
      modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
    });
  
    // Handle resize
    const adjustSidebarOnResize = () => {
      const isDesktop = window.innerWidth >= 1024;
  
      if (isDesktop) {
        sidebar.style.height = "100%";
        sidebar.classList.remove("menu-active");
        isMenuOpen = false;
      } else {
        sidebar.style.height = "auto";
        sidebar.classList.remove("menu-active");
        sidebar.classList.remove("close"); // never collapse on mobile
        isMenuOpen = false;
        const span = menu.querySelector("span");
        if (span) span.innerText = "menu";
      }
    };
  
    window.addEventListener("resize", adjustSidebarOnResize);
    setInitialSidebarState(); // <-- set on load
  });
  
 // setInitialSidebarState(); // <-- required on load
