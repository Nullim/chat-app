import { useState } from "react"
import { toast } from "react-toastify"

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { passRecovery } from "../../../../redux/thunks/authThunk"
import { PENDING_MESSAGE } from "../../../../utils/constants"
import { ResetPassProps } from "../../../../pages/home/Home"

const PassResetRequest: React.FC<ResetPassProps> = ({ setReset }) => {
  const [email, setEmail] = useState<string>('')
  const dispatch = useAppDispatch()

  const auth = useAppSelector(state => state.auth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      email
    }
    toast.promise(dispatch(passRecovery(payload)).unwrap(), {
      error: {
        render({ data }: { data: string }) {
          return data
        }
      }
    })
  }
  
  return (
    <form className="form-body" onSubmit={handleSubmit}>
      <p className="form-utilities" onClick={() => setReset(false)}>&lt;- Return</p>
      <div className="form-wrapper">
        <p style={{ paddingBottom: "10px", fontStyle: "italic" }}>
          Please type in your email and we&#39;ll send you a recovery code.
        </p>
        <label className="form-label" htmlFor="recoveryEmail">Email</label>
        <input
          className="form-input"
          name="recoveryEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-button-container">
        <button
          type="submit"
          className={`form-button ${auth.recoveryStatus === PENDING_MESSAGE ? 'form-button-loading' : ''}`}
          disabled={auth.recoveryStatus === PENDING_MESSAGE}
        >
          {auth.recoveryStatus === PENDING_MESSAGE ? <div className="loading">Loading</div> : <div>Send</div>}
        </button>
      </div>
    </form>
  )
}

export default PassResetRequest