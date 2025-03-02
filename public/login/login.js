document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
  
    // 获取用户输入
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
  
    // 前端验证
    let isValid = true;
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
  
    if (!username) {
      usernameError.textContent = 'Username is required';
      isValid = false;
    } else {
      usernameError.textContent = '';
    }
  
    if (!password) {
      passwordError.textContent = 'Password is required';
      isValid = false;
    } else {
      passwordError.textContent = '';
    }
  
    if (!isValid) {
      return; // 如果验证失败，停止后续操作
    }
  
    // 发送数据到后端
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
      console.log("Response Body: ", result);
  
      if (response.ok) {
        // 登录成功
        document.getElementById('message').textContent = 'Login successful!';
        document.getElementById('message').style.color = 'green';
        // 可以在这里跳转到其他页面或执行其他逻辑
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        window.location.href = '/chat';
      } else {
        // 登录失败
        document.getElementById('message').textContent = result.message || 'Invalid username or password';
        document.getElementById('message').style.color = 'red';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'An error occurred. Please try again.';
      document.getElementById('message').style.color = 'red';
    }
  });