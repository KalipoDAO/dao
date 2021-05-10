import React, {useContext, useEffect, useState} from "react";
import {
  Button,
  Container,
  Form,
  FormColumn,
  FormElement,
  FormRow,
  InputAvatar,
  TextFieldInput,
  Typography,
  SimpleInput,
} from "@moosty/dao-storybook"
import moment from 'moment';
import {useMembers} from "../hooks/members";
import {createTransaction} from "../utils/transactions";
import {Buffer} from "@liskhq/lisk-client";
import {transactionStates} from "@moosty/dao-storybook/dist/stories/modals/templates/resultTransaction";
import {AppContext} from "../appContext";
import {useHistory} from "react-router-dom";
import {allDaoData} from "@moosty/dao-storybook/dist/fixtures/daos";
import {useDaos} from "../hooks/daos";

const allVotingTypes = [{
  id: "NONE",
  name: 'Select a voting type',
  icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/mode/v8/24px.svg'
}, {
  id: "BINARY",
  name: 'YES/NO',
  icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/thumbs_up_down/v10/24px.svg'
}, {
  id: "MULTIPLE_CHOICE",
  name: 'Multiple Choice',
  icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/checklist_rtl/v1/24px.svg'
}, {
  id: "QUADRATIC_VOTING",
  name: 'Quadratic Voting',
  icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/auto_fix_high/v12/24px.svg'
}, {
  id: "ADD_MEMBER",
  name: 'Invite member',
  icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/person_add/v11/24px.svg'
},
]

export const CreateVoting = ({account, setModal}) => {
  const history = useHistory();
  const {getClient} = useContext(AppContext);
  const {members} = useMembers();
  const {daos} = useDaos();
  const [formData, setFormData] = useState();
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [votingType, setVotingType] = useState(allVotingTypes[1]);

  useEffect(() => {
    let errors = {}
    if (formData?.start) {
      if (moment(formData.start).isBefore(moment())) {
        errors.start = "Proposal start date should be in the future"
      }
    }
    setFormErrors(errors)
  }, [formData])

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const onCreate = async () => {
    const client = await getClient
    const fee = await createTransaction({
      moduleId: 3500,
      assetId: 0,
      assets: {
        name: formData.name,
        members: [
          ...formData.members.map(m => m?.value?.address && ({
            id: new Buffer.from(m.value.address, 'hex'),
            isDao: false,
          })).filter(Boolean),
        ],
        rules: {},
        description: formData.description,
      },
      account,
      client,
      getFee: true,
    })
    setModal({
      type: "transactionConfirm",
      address: account.address,
      name: account.username,
      transactionType: "dao:create",
      fee: `${fee} LSK`,
      ctaButton: {
        label: "Confirm",
        onClick: () => onSubmit()
      }
    })
  }

  const onSubmit = async () => {
    setLoadingCreate(true)
    setModal({
      type: "transactionResult",
      text: `Submitting transaction, this can take a few seconds.`,
      state: transactionStates.pending,
    })
    const client = await getClient;
    const result = await createTransaction({
      moduleId: 3500,
      assetId: 0,
      assets: {
        name: formData.name,
        members: [
          ...formData.members.map(m => m?.value?.address && ({
            id: new Buffer.from(m.value.address, 'hex'),
            isDao: false,
          })).filter(Boolean),
        ],
        rules: {},
        description: formData.description,
      },
      account,
      client,
    })
    if (result.status) {
      const findTransaction = async () => {
        try {
          await client.transaction.get(Buffer.from(result.message.transactionId, 'hex'))
          setError(null)
          setLoadingCreate(false)
          setSuccess(true)
          setModal({
            type: "transactionResult",
            text: `Your DAO is created successfully`,
            state: transactionStates.confirmed
          })
          history.push('/')
        } catch (e) {
          setTimeout(async () => await findTransaction(), 1000)
        }
      }
      await findTransaction()

    } else {
      setError(result.message)
      setLoadingCreate(false)
      setModal({type: "transactionResult", text: result.message, state: transactionStates.error})
    }
  }

  useEffect(() => {
    if (!account) {
      setModal("login")
    }
  }, [account])

  useEffect(() => console.log(formData), [formData])

  return (<Container>
    <div className="lg:ml-4 my-4 ">
      <Typography type="h2" Element='h2'>
        Create a Proposal
      </Typography>
    </div>
    {/*Form*/}
    <Form className="lg:grid lg:grid-cols-2  lg:divide-x-2 lg:divide-formDivider lg:h-screen">
      {/*COLUMN LEFT */}
      <FormColumn className="lg:mx-4 lg:mr-10">
        <FormRow>
          <FormElement
            label="Select a DAO">
            <InputAvatar
              value={formData?.dao || ""}
              items={[allDaoData[0], ...daos.map(d => ({
                id: d.id,
                name: d.name,
                icon: `https://avatar.moosty.com/${d.id}`,
              }))]}
              selected={{
                ...allDaoData[0],
              }}
              onChange={(value) => updateFormData('dao', value)}
            />
          </FormElement>
        </FormRow>
        <FormRow>
          <FormElement
            label="Type of voting">
            <InputAvatar
              onChange={setVotingType}
              label={"Select Voting type"}
              items={allVotingTypes}
                         selectedItem={votingType}/>
          </FormElement>
        </FormRow>
        {votingType.id !== "ADD_MEMBER" && <FormRow>
          <FormElement label="Description">
            <TextFieldInput
              onChange={({target: {value}}) => updateFormData('description', value)}
              placeholder="What are you proposing?"/>
          </FormElement>
        </FormRow>}
      </FormColumn>

      {/*COLUMN RIGHT*/}
      <FormColumn className="">
        <div className="lg:ml-10 ">
          <FormRow className="flex-col">
            <FormElement
              label="Start Date"
              errorMessage={formErrors?.start}
              error={formErrors?.start}
            >
              <SimpleInput
                error={formErrors?.start}
                default
                placeholder="02/02/1988"
                datePicker
                onChange={({target: {value}}) => updateFormData('start', value)}
                label={"datepicker mockup"}
              />
            </FormElement>
          </FormRow>
          <div className="pt-5">
            <div className="flex justify-end">
              <Button
                shadow
                onClick={() => setFormData({})}
                label="Cancel"
                secondary
              />
              <Button
                disabled={formErrors?.description}
                onClick={onCreate}
                iconBefore
                label="Create Proposal"
                className="ml-2"
                shadow
                icon={<svg
                  className="mr-2"
                  width="21"
                  height="22"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.211 1.36361L1.74279 6.29055C1.59583 6.332 1.46503 6.41731 1.36786 6.53509C1.27069 6.65287 1.21178 6.79751 1.19901 6.94966C1.18624 7.10182 1.22021 7.25424 1.29639 7.38657C1.37257 7.5189 1.48733 7.62483 1.62532 7.69019L9.65133 11.492C9.80787 11.5661 9.93392 11.6922 10.0081 11.8487L13.8099 19.8747C13.8752 20.0127 13.9812 20.1275 14.1135 20.2037C14.2458 20.2798 14.3982 20.3138 14.5504 20.301C14.7025 20.2883 14.8472 20.2294 14.965 20.1322C15.0827 20.035 15.1681 19.9042 15.2095 19.7573L20.1364 2.28904C20.1726 2.16073 20.174 2.02509 20.1403 1.89609C20.1066 1.76709 20.0392 1.64939 19.9449 1.55512C19.8507 1.46085 19.733 1.39341 19.604 1.35975C19.475 1.32609 19.3393 1.32742 19.211 1.36361Z"
                    stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.8934 11.6067L14.136 7.36401" stroke="white" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>}
              />
            </div>
          </div>
        </div>
      </FormColumn>
    </Form>
  </Container>)
}