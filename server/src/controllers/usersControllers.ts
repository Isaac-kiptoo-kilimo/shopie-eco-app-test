import { Request, Response } from "express"
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import mssql from 'mssql'
import { dbConfig } from "../config/db"
import { loginUserValidation, regUserValidation, validateUpdateuser } from "../validators/validators"
import { ExtendeUser } from "../middlewares/verifyToken"
import jwt from 'jsonwebtoken'
import Connection from "../dbhelpers/dbhelpers"
import { generateResetToken } from "../utils/generateResetToken"


const dbhelpers = new Connection

export const registerUserControllers = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, profileImage } = req.body


    const { error } = regUserValidation.validate(req.body)
    if (error) {
      return res.status(404).json({
        message: "Check your username/password/email kindly",
        error: error.details

      })
    }

    const userID = v4()
    const hashedpwd = await bcrypt.hash(password, 5);
    const pool = await mssql.connect(dbConfig)



    const results = pool.request()
      .input('userID', mssql.VarChar, userID)
      .input('fullName', mssql.VarChar, fullName)
      .input('email', mssql.VarChar, email)
      .input('password', mssql.VarChar, hashedpwd)
      .input('profileImage', mssql.VarChar, profileImage)
      .execute('registerUser')

    return res.status(201).json({
      message: 'User registered successfully'
    })


  } catch (error) {
    return res.status(404).json({
      error: error,
      message: "Server error"
    })
  }
}

export const loginUserControllers = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const { error } = loginUserValidation.validate(req.body)

    if (error) {
      return res.json({
        error: error.details
      })
    }

    const pool = await mssql.connect(dbConfig);
    const user = await (await pool.request().input('email', mssql.VarChar, email).input('password', mssql.VarChar, password).execute('loginUser')).recordset
    // console.log(user);

    if (user[0]?.email == email) {
      const correctPWD = await bcrypt.compare(password, user[0]?.password);

      if (!correctPWD) {
        return res.status(404).json({
          error: "Incorrect Password"
        })
      }

      const loginCredentials = user.map((records) => {
        const { password, ...rest } = records;
        return rest
      });

      const token = jwt.sign(loginCredentials[0], process.env.SECRET as string, {
        expiresIn: '48h'
      })

      return res.status(201).json({
        message: 'User Logged in successfully',
        token
      })
    } else {
      return res.json({
        error: "Email not found"
      })
    }
  } catch (error) {
    return res.json({
      error: error
    })
  }
}



export const checkCredentials = async (req: ExtendeUser, res: Response) => {
  if (req.info) {
    return res.json({
      info: req.info
    })
  }
}



export const getUserDetails = async (req: ExtendeUser, res: Response) => {
  try {
    const user = req.info
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      })
    }

    const pool = await mssql.connect(dbConfig);
    const userID = user.userID
    console.log(userID);

    const result = await dbhelpers.execute('GetUserDetails', { userID });

    const userDetails = result.recordset
    console.log(userDetails);
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });

    }

    return res.status(200).json(userDetails);

  } catch (error) {
    return res.json({
      error: error
    })
  }
}


export const updateUserControllers = async (req: Request, res: Response) => {
  try {

    const { fullName, email, profileImage } = req.body
    const { userID } = req.params
    const { error } = validateUpdateuser.validate(req.body);
    if (error)
      return res.status(403).json({ success: false, message: error.details[0].message });

    const pool = await mssql.connect(dbConfig)

    const updatedUser = await pool.request().input('userID', mssql.VarChar, userID).input('fullName', mssql.VarChar, fullName).input('email', mssql.VarChar, email).input('profileImage', mssql.VarChar, profileImage).execute('updateUser')

    return res.json({
      message: "User updated successfully"
    });

  } catch (error) {
    return res.json({
      error: error
    })
  }
}

export const fetchAllUsersControllers = async (req: Request, res: Response) => {
  try {

    const pool = await mssql.connect(dbConfig);
    let users = (await pool.request().execute('getAllUsers')).recordset

    return res.status(201).json(users)

  } catch (error) {
    return res.json({
      error: error
    })
  }
}



export const getSingleUserController = async (req: Request, res: Response) => {
  try {
    const userID = req.params.userID;
    console.log(userID);
    if (!userID) return res.status(403).send({ message: "Id is required" });


    const result = await dbhelpers.execute('getSingleUser', { userID });

    res.json(result.recordset);

  } catch (error) {
    return res.json(400).json({
      error: error
    })
  }
};


export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params

    const deleteUser = await dbhelpers.execute('deleteUser', { userID })
    return res.json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    return res.json({
      error: error
    })
  }
}


export const initiatePasswordResetController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await dbhelpers.execute('getUserByEmail', { email });

    if (!user.recordset || user.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = generateResetToken();
    console.log(resetToken);

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    await dbhelpers.execute('SetResetTokenAndExpiration', {
      email,
      resetToken,
      expiryTime: expiration.toISOString(),
    });

    //  let newToken= sendResetTokenByEmail(email, resetToken);
    // console.log(newToken);

    res.status(200).json({ message: 'Reset token sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const resetPasswordControllers = async (req: Request, res: Response) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    console.log("reset token ", resetToken);
    newPassword
    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await dbhelpers.execute('ResetPassword', {
      email,
      resetToken,
      newPassword: hashedPassword,
    });

    console.log("rows affected", result.rowsAffected);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Password reset successful.' });
      return;
    }

    console.log("Record sets", result.recordset);

    if (result.recordset && result.recordset.length > 0) {
      const message = result.recordset[0].message;
      console.log("message:", message);

      if (message === 'Password updated successfully') {
        res.status(200).json({ message: 'Password reset successful' });
      } else if (message === 'Invalid token') {
        res.status(400).json({ message: 'Invalid reset token' });
      } else if (message === 'Invalid email') {
        res.status(400).json({ message: 'Invalid email' });
      } else {
        res.status(500).json({
          message: 'Error resetting password',
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



// export const setResetTokenAndExpirationController = async (req: Request, res: Response) => {
//   try {
//     const { userID, resetToken, expiration } = req.body;

//     // Update the reset token and expiration using the database helper class
//     const result = await dbhelpers.execute('SetResetTokenAndExpiration', {
//       userID,
//       resetToken,
//       expiration,
//     });

//     if (result.rowsAffected[0] > 0) {
//       res.status(200).json({ message: 'Reset token and expiration set successfully.' });
//     } else {
//       res.status(404).json({ message: 'User not found or reset token not set.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// export const checkResetTokenExpiryController = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;

//     // Check reset token expiry using the database helper class

//     const newDateTime = new Date().toISOString()
//     const result = await dbhelpers.execute('CheckResetTokenExpiry', {
//       userID,
//       currentDateTime: newDateTime,
//     });

//     const resetTokenExpires = result.recordset[0]?.resetPasswordExpires;

//     if (resetTokenExpires && new Date(resetTokenExpires) > new Date()) {
//       res.status(200).json({ message: 'Reset token is still valid.' });
//     } else {
//       res.status(400).json({ message: 'Invalid or expired reset token.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


export const forgotPasswordController = (req: Request, res: Response) => {
  try {

  } catch (error) {
    return res.json({
      error: error
    })
  }
}


