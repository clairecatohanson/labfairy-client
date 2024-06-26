import { useContext, useEffect, useState } from "react"
import { Select } from "../form-elements/Select"
import { FormLayout } from "../layouts/FormLayout"
import { getEquipment } from "../../data/equipment"
import { getMaintenanceTypes } from "../../data/maintenance"
import { AppContext } from "../../context/AppWrapper"
import { Input } from "../form-elements/Input"
import { useNavigate } from "react-router-dom"

export const EquipmentMaintenanceForm = ({
  deleteFunction = undefined,
  formEl,
  heading,
  id = undefined,
  setShowModal,
  staticJSX = undefined,
  submitFunction,
  title,
  updateFunction = undefined,
}) => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()

  const [equipmentList, setEquipmentList] = useState([])
  const [maintenanceTypes, setMaintenanceTypes] = useState([])

  useEffect(() => {
    getEquipment({ query: "restricted=access" }).then((equipmentData) => {
      if (equipmentData) {
        setEquipmentList(equipmentData)
      }
    })

    getMaintenanceTypes().then((maintenanceData) => {
      if (maintenanceData) {
        setMaintenanceTypes(maintenanceData)
      }
    })
  }, [])

  return (
    <FormLayout title={title}>
      <form className="form" ref={formEl}>
        <h3 className="form-heading">{heading}</h3>
        {staticJSX && staticJSX}
        {!id && (
          <>
            <Select
              id="equipment"
              defaultOption="Select equipment"
              dropdownOptions={equipmentList}
              width="w-96"
            />
            <Select
              id="maintenanceType"
              defaultOption="Select maintenance type"
              dropdownOptions={maintenanceTypes}
              width="w-96"
            />
          </>
        )}
        <Input id="dateNeeded" label="Date Needed" type="date" />
        {user.admin && (
          <Input id="dateScheduled" label="Date Scheduled" type="date" />
        )}
      </form>
      <div className="flex flex-col space-y-4 items-center">
        <div className="form-actions">
          {!id ? (
            <button
              className="btn bg-bluegreen-500 text-gray-100 border-2 border-bluegreen-700"
              onClick={submitFunction}
            >
              {user.admin ? "Schedule" : "Request"}
            </button>
          ) : (
            <>
              <button
                className="btn bg-bluegreen-500 text-gray-100 border-2 border-bluegreen-700"
                onClick={submitFunction}
              >
                Schedule
              </button>
              <button
                className="btn bg-bluegreen-500 text-gray-100 border-2 border-bluegreen-700"
                onClick={updateFunction}
              >
                Cancel Maintenance
              </button>
              <button
                className="btn bg-bluegreen-500 text-gray-100 border-2 border-bluegreen-700"
                onClick={() => {
                  setShowModal(true)
                }}
              >
                Complete
              </button>
            </>
          )}
        </div>
        {id && (
          <div className="form-actions">
            <button
              className="btn border-pink-500 border-4 shadow bg-gray-200"
              onClick={deleteFunction}
            >
              Cancel and Delete
            </button>
          </div>
        )}
        <div className="form-actions">
          <button
            className="btn border-pink-500 border-4 shadow bg-gray-200"
            onClick={() => {
              navigate("/maintenance")
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </FormLayout>
  )
}
