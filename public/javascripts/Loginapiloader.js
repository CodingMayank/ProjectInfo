// Clear 'token' cookie on back/forward navigation
window.addEventListener('pageshow', function (event) {
  if (event.persisted || performance.navigation.type === 2) {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Token cookie cleared on back navigation");
  }
});

// Optional: Always clear token when login page loads
document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

document.getElementById("userForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent default form submission

  const loader = document.getElementById("loader");
  const submitBtn = document.getElementById("submitBtn");
  const errorMsg = document.getElementById("errorMessage");

  loader.classList.remove("hidden");
  submitBtn.disabled = true;
  errorMsg.classList.add("hidden");

  const email = this.email.value;
  const password = this.password.value;

  try {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const username = data.user.fullname;
      const userId = data.user.id;
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        window.location.href = `/user/profile/${userId}/${username}`;
      }, 2000);
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (err) {
    loader.classList.add("hidden");
    submitBtn.disabled = false;
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
});
