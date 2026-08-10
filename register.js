```html
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Register | WaterGuardian-X</title>

    <link rel="stylesheet" href="register.css">

</head>

<body>

<div class="container">

    <div class="register-card">

        <div class="logo">
            💧
        </div>

        <h1>
            WaterGuardian-X
        </h1>

        <p>
            Create Citizen Account
        </p>

        <form id="registerForm">

            <!-- NAME -->
            <input
                type="text"
                id="name"
                placeholder="Full Name"
                required
            >

            <!-- EMAIL -->
            <input
                type="email"
                id="email"
                placeholder="Email Address"
                required
            >

            <!-- PHONE -->
            <input
                type="text"
                id="phone"
                placeholder="Mobile Number"
                maxlength="10"
                required
            >

            <!-- COUNTRY -->
            <select id="countrySelect" required>

                <option value="">
                    Select Country
                </option>

            </select>


            <!-- STATE -->
            <select id="stateSelect" required disabled>

                <option value="">
                    Select State
                </option>

            </select>


            <!-- DISTRICT -->
            <select id="districtSelect" required disabled>

                <option value="">
                    Select District
                </option>

            </select>


            <!-- ADDRESS -->
            <input
                type="text"
                id="address"
                placeholder="Address"
                required
            >


            <!-- PASSWORD -->
            <input
                type="password"
                id="password"
                placeholder="Password"
                required
            >


            <!-- CONFIRM PASSWORD -->
            <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                required
            >


            <button type="submit">
                Create Account
            </button>


            <p id="message"></p>

        </form>


        <a href="login.html">
            Already have account? Login
        </a>

    </div>

</div>


<script src="register.js"></script>

</body>

</html>
```
