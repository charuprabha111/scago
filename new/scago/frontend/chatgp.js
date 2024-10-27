document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login");
    const emailBox = document.getElementById("emailbox");
    const passBox = document.getElementById("passbox");
  
    function showAlert(message) {
      alert(message);
    }
  
    loginButton.addEventListener("click", async (e) => {
      e.preventDefault();
  
      const username = emailBox.value.trim();
      const password = passBox.value.trim();
  
      if (!username || !password) {
        showAlert("Please enter both username and password.");
      } else {
        try {
          const response = await fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            showAlert(result.message);
            setTimeout(() => {
              window.location.href = result.redirect;
            }, 1000);
          } else {
            showAlert(result.message);
          }
        } catch (error) {
          showAlert("An error occurred. Please try again.");
        }
      }
    });
  });
  