document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
  
    // 获取用户输入
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // 前端验证
    let isValid = true;
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
  
    if (username.length < 5) {
      usernameError.textContent = 'Username must be at least 5 characters long';
      isValid = false;
    } else {
      usernameError.textContent = '';
    }
  
    if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters long';
      isValid = false;
    } else {
      passwordError.textContent = '';
    }
  
    if (!isValid) {
      return; // 如果验证失败，停止后续操作
    }
  
    // 发送数据到后端
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("response: ", response);
  
      const result = await response.json();
  
      if (response.ok) {
        document.getElementById('message').textContent = 'Registration successful!';
        document.getElementById('message').style.color = 'green';
      } else {
        document.getElementById('message').textContent = result.message || 'Registration failed';
        document.getElementById('message').style.color = 'red';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'An error occurred. Please try again.';
      document.getElementById('message').style.color = 'red';
    }
  });