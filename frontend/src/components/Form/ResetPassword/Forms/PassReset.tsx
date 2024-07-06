import { useState } from "react"
import { toast } from "react-toastify"

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { resetPassword } from "../../../../redux/auth/authThunk"
import { PENDING_MESSAGE } from "../../../../utils/constants"
import { ResetPassProps } from "../../../../pages/home/Home"

const PassReset: React.FC<ResetPassProps> = ({ setReset }) => {
  const [pass, setPass] = useState<string>('')
  const [confirmPass, setConfirmPass] = useState<string>('')
  const dispatch = useAppDispatch()
  const resetPassStatus = useAppSelector(state => state.auth.resetPassStatus)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      password: pass,
      confirmPassword: confirmPass
    }
    toast.promise(dispatch(resetPassword(payload)).unwrap(), {
      success: {
        render() {
          setReset(false)
          return 'Success! Try logging in.'
        }
      },
      error: {
        render({ data }: { data: string }) {
          return data
        }
      }
    })
  }

  return (
    <form className="form-body" onSubmit={handleSubmit}>
      <div className="form-wrapper">
        <p style={{ paddingBottom: "10px", fontStyle: "italic" }}>
          Please type in your new password.
        </p>
        <label className="form-label" htmlFor="recoveryPass">Password</label>
        <input
          className="form-input"
          name="recoveryPass"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
      <div className="form-wrapper">
        <label className="form-label" htmlFor="confirmRecoveryPass">Confirm Password</label>
        <input
          className="form-input"
          name="confirmRecoveryPass"
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
      </div>
      <div className="form-button-container">
        <button
          type="submit"
          className={`form-button ${resetPassStatus === PENDING_MESSAGE ? 'form-button-loading' : ''}`}
          disabled={resetPassStatus === PENDING_MESSAGE}
        >
          {resetPassStatus === PENDING_MESSAGE ? <div className="loading">Loading</div> : <div>Send</div>}
        </button>
      </div>
    </form>
  )
}

export default PassReset