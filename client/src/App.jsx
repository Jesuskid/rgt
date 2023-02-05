import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Home from './pages/Home'
import Info from './pages/Info'
import { useEthers, AvalancheTestnet, Avalanche } from '@usedapp/core'
import { Row, Col } from 'react-bootstrap'
import { address, Token } from './utils'

function App() {


  const [count, setCount] = useState(0)
  const { account, chainId } = useEthers()

  useEffect(() => {
    if (chainId != AvalancheTestnet) {
      request()
    }
    async function request() {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA869' }], // chainId must be in hexadecimal numbers
      });
    }
  }, [, chainId])

  return (
    <>
      <header style={{ width: "100vh" }} className='d-flex flex-row justify-content-between w-full w-100'>
        <h2 className='text-gradient'>MTK Stake RGT</h2>
        {account && (<p style={{ borderRadius: "5px" }} className='border text-white py-1 px-3'>{account.slice(0, 10)}...{account.slice(20, 30)}</p>)}
      </header>

      <div className="App d-flex flex-column">

        <div>
        </div>
        <Home />
        <p className="read-the-docs">
          Stake your tokens to earn 0.1 or more SRWD rewards every 24 hours
        </p>
        <Info />
        <Row className='mt-2 justify-content-between d-flex'>
          <Col sm={12} md={4} className='text-white mt-1 justify-content-start align-items-start'>
            <a target='_blank' href='https://github.com/Jesuskid/rgt'>Github</a>
          </Col>
          <Col sm={12} md={4} className='text-white mt-1 justify-content-start align-items-start'>
            <a target='_blank' href={`https://testnet.snowtrace.io/address/${address}`}>Contract</a>
          </Col>
          <Col sm={12} md={4} className='text-white  mt-1 justify-content-start align-items-start'>
            <a target='_blank' href={`https://testnet.snowtrace.io/address/${Token}`}>MTKToken</a>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default App
