import classes from './ProfileForm.module.css';
import { useContext, useRef } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {

  const resetPasswordRef = useRef();
  const authCtx = useContext(AuthContext)
  const history = useHistory()
  const resetHandler = (e) => {
    e.preventDefault();
    const resetPasswordInput = resetPasswordRef.current.value;
    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAjWSRz5zsbkEjf6vk-mHqJ259DBKO3BWE`, {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token.idToken,
        password: resetPasswordInput,
        returnSecureToken: false 
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      if (res.ok) {
        return res.json().then(data => {
          authCtx.update(data)
          history.replace('/')

          // alert('password has changed successfuly', data)
        })
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authentication failed'; 
          throw new Error(errorMessage)
        })
      }
    })
    .catch(err => {
      alert(err.message)
    })
    console.log(authCtx.token.idToken);
  }


  return (
    <form className={classes.form} onSubmit={(e) => resetHandler(e)} >
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="6" ref={resetPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
