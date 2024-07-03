import { useState } from "react"
import { toast } from "react-toastify"

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { recoveryVerification } from "../../../../redux/thunks/authThunk"
import { PENDING_MESSAGE } from "../../../../utils/constants"

const PassResetVerification = () => {
  const [code, setCode] = useState<string>('')
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.auth)

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
          className={`form-button ${auth.recoveryVerificationStatus === PENDING_MESSAGE ? 'form-button-loading' : ''}`}
          disabled={auth.recoveryVerificationStatus === PENDING_MESSAGE}
        >
          {auth.recoveryVerificationStatus === PENDING_MESSAGE ? <div className="loading">Loading</div> : <div>Send</div>}
        </button>
      </div>
    </form>
  )
}

export default PassResetVerification