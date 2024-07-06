import { useState } from "react"
import { toast } from "react-toastify"

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { recoveryVerification } from "../../../../redux/auth/authThunk"
import { PENDING_MESSAGE } from "../../../../utils/constants"

const PassResetVerification = () => {
  const [code, setCode] = useState<string>('')
  const dispatch = useAppDispatch()
  const recoveryVerificationStatus = useAppSelector(state => state.auth.recoveryVerificationStatus)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      code
    }
    toast.promise(dispatch(recoveryVerification(payload)).unwrap(), {
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
          Check your inbox and please type in your code below.
        </p>
        <label className="form-label" htmlFor="recoveryCode">Verification Code</label>
        <input
          className="form-input"
          name="recoveryCode"
          type="number"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="form-button-container">
        <button
          type="submit"
          className={`form-button ${recoveryVerificationStatus === PENDING_MESSAGE ? 'form-button-loading' : ''}`}
          disabled={recoveryVerificationStatus === PENDING_MESSAGE}
        >
          {recoveryVerificationStatus === PENDING_MESSAGE ? <div className="loading">Loading</div> : <div>Send</div>}
        </button>
      </div>
    </form>
  )
}

export default PassResetVerification