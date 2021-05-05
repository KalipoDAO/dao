import React, {useEffect, useState} from "react";
import {passphrase, cryptography} from "@liskhq/lisk-client";
import {Typography, Modal, CreateAccountModal, LoginModal} from '@moosty/dao-storybook';
export const ModalContainer = ({currentOpen, setCurrentOpen, externalError, ctaLoading, onLogin, onRegister}) => {

  const [registerAccounts, setRegisterAccounts] = useState();
  const [passphraseInput, setPassphrase] = useState();
  const [account, changeAccount] = useState(null)
  const [username, setUsername] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [disabledCTA, setDisabledCTA] = useState(true)

  useEffect(() => {
    if (username) {
      if (username.length > 30) {
        setUsernameError("Username should be 30 characters or shorter")
        return;
      }
      if (username.length < 3) {
        setUsernameError("Username should be at least 3 characters long")
        return;
      }
      const usernameRegex = /^(?=.{3,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
      if (!username.match(usernameRegex)) {
        setUsernameError(<div>
          Username only allowed [a-zA-Z0-9._] <br/>
          (do not start or end with _ or . nor use them double)
        </div>)
        return;
      }
      setUsernameError(null)
      setDisabledCTA(false)
    }
  }, [username])

  useEffect(() => {
    changeAccount(createAccount(passphraseInput?.join(" ")))
    setDisabledCTA(false)
  }, [passphraseInput])

  useEffect(() => {
    switch (currentOpen) {
      case 'register':
        const newAccounts = [
          createAccount(passphrase.Mnemonic.generateMnemonic()),
          createAccount(passphrase.Mnemonic.generateMnemonic()),
          createAccount(passphrase.Mnemonic.generateMnemonic()),
        ]
        setRegisterAccounts(newAccounts)
        changeAccount(newAccounts[0])
        setUsername("")
        setDisabledCTA(true)
        break;
      default:
        setDisabledCTA(true)
    }
  }, [currentOpen])

  const createAccount = (passphrase) => passphrase && ({
    passphrase: passphrase?.split(" "),
    address: cryptography.getAddressFromPassphrase(passphrase).toString('hex'),
    ...cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase),
  })

  return <Modal
    ctaButton={(currentOpen === 'login' || currentOpen === 'register') && {
      disabled: disabledCTA || ctaLoading,
      label: [
        !ctaLoading && currentOpen === 'login' && "Sign in!",
        !ctaLoading && currentOpen === 'register' && "Sign up!",
        ctaLoading && "Loading...",
        ].filter(Boolean).join(),
      onClick: () => {
        if (currentOpen === 'login') {
          onLogin(account)
        }
        if (currentOpen === 'register') {
          onRegister({
            ...account,
            username,
          })
        }
      },
    }}
    onClose={() => setCurrentOpen(null)}
    open={!!currentOpen}
  >
    {currentOpen === 'register' && <CreateAccountModal
      accounts={registerAccounts}
      changeAccount={changeAccount}
      changeUsername={setUsername}
      gotoLogin={() => setCurrentOpen('login')}
      selectedAccount={account}
      username={username}
      usernameError={usernameError}
    />}
    <Typography Element="h2" className={"w-full text-center text-dangerDark"}>{externalError}</Typography>
    {currentOpen === 'login' && <LoginModal
      gotoSignup={() => setCurrentOpen("register")}
      changePassphrase={setPassphrase}
    />}
  </Modal>
}