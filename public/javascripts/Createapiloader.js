document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  

    document.getElementById("loader").classList.remove("hidden");
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch("/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Account created successfully
        document.getElementById("message").innerText = result.message || "Account created!";
        document.getElementById("message").classList.add("text-green-500");
  
        // 2 sec ka wait then redirect
        setTimeout(() => {
          window.location.href = "/user/login";
        }, 2000);
      } else {
        //  Server responded with an error (like email already used)
        document.getElementById("message").innerText = result.message || "Something went wrong!";
        document.getElementById("message").classList.add("text-red-500");
      }
    } catch (error) {
      //  Network/server issue
      document.getElementById("message").innerText = "Server error. Please try again.";
      document.getElementById("message").classList.add("text-red-500");
    }
  
    // Hide loader and re-enable button
    document.getElementById("loader").classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
  });
  