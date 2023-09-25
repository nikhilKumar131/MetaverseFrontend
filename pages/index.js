import Youtube from "react-youtube";
import { useRef, useState, useEffect } from 'react';
import web3modal from "web3modal";
import { ethers } from 'ethers';
import { address, ABI } from '../contracts/smc';

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 1,
  }
}
export default function Home() {

  const [tokenBalance, setTokenBalance] = useState(0);
  let web3modalRef = useRef();
  const [walletStatus, setWalletStatus] = useState(false);


  const [name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [phNumber, setPhNumber] = useState();
  const [data, setData] = useState([]);





  async function getProviderOrSigner(signer = false) {
    try {
      const provider = await web3modalRef.current.connect()
      const providers = new ethers.providers.Web3Provider(provider)

      //checking network connected
      const { chainId } = await providers.getNetwork();
      if (chainId !== 11155111) {
        window.alert("Change the network to Sepolai");
        throw new Error("Change network to Sepolai");
      }
      5
      if (signer) {
        const signer = providers.getSigner();
        return signer;
      }

      return providers;
    }
    catch {
      (err) => { console.error(err) }
    }

  }

  useEffect(() => {
    if (walletStatus == false) {
      web3modalRef.current = new web3modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      getProviderOrSigner()
      setWalletStatus(true)

    }
    try { balance() } catch { err => { console.error(err) } }

  }, [walletStatus])

  //functions
  // lib/fetchData.js

  async function fetchData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }


  function DataPage() {
    const apiUrl = 'https://metaverseassign-production.up.railway.app/tasks'; // Replace with your API URL

    useEffect(() => {
      fetchData(apiUrl)
        .then((result) => {
          const reversedData = result.reverse();
          setData(reversedData);
          console.log(reversedData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, []);
  }


  async function set() {
    const signer = await getProviderOrSigner(true);
    const addr = await signer.getAddress();


    const contract = new ethers.Contract(address, ABI, signer);
    const txn = await contract.setContactDetails(name, Address, phNumber);
    const reciept = await txn.wait();
    console.log(reciept);
  }

  DataPage();



  return (

    <div className=" bg-gray-800 h-full text-white">
      <div className=" ">
        <img src="banner.jpg" className="absolute w-full overflow-hidden" />

        <div className=" h-96 flex flex-row  items-center w-screen relative">
          <div className="ml-20 w-3/5">
            <h1 className="text-4xl">Contact Deails</h1>
            <p className="text-lg">Please switch to <span className="font-bold text-xl">SEPOLAIeth</span> test network</p>
            <p className="text-lg mb-5">Connect to metamask. Save contract Details. REFRESH TO UPDATE</p>
            <button className="bg-orange-500 rounded-full mb-5 ">< a className=" text-lg mt-10 mx-10" onClick={getProviderOrSigner}>MetaMask</a></button>
            <p className="text-lg my-5">Set new Contact Details.</p>
            <input className="mr-10 bg-gray-800 rounded-xl hover:bg-gray-500" placeholder=" Name" onChange={(e) => { setName(e.target.value) }} />
            <input className="mx-10 bg-gray-800 rounded-xl hover:bg-gray-500" placeholder=" Address" onChange={(e) => { setAddress(e.target.value) }} />
            <br />
            <input className="mr-10 mt-5 bg-gray-800 rounded-xl hover:bg-gray-500" placeholder=" PhNumber(uint)" onChange={(e) => { setPhNumber(e.target.value) }} />
            <br />
            <button className="bg-orange-500 mt-5 rounded-full " onClick={set}>< a className=" text-lg mt-10 mx-10" >Set</a></button>
          </div>
          <div className="flex w-2/5 justify-center items-center">
            <Youtube videoId="hM-IGk70aRQ" onReady={(e) => { e.target.pauseVideo() }} opts={opts} className="relative align-middle mt-20" />
          </div>

        </div>
        <div className="relative ml-20 mt-36">
          <div className="">
            Some important Links.
          </div>
          <div className="">
            click <a className="text-blue-700 " href="https://github.com/nikhilKumar131/MetaverseFrontend/blob/main/contracts/contract.sol" target="_blank">here</a> to get to github link of the deployed SMART CONTRACT</div>
          <div className="">click <a className="text-blue-700 " href="https://github.com/nikhilKumar131/MetaVerseAssign" target="_blank">here</a> to get to github link of the deployed NESTJS SERVER</div>
          <div className="">click <a className="text-blue-700 " href="https://github.com/nikhilKumar131/MetaverseFrontend" target="_blank">here</a> to get to github link of the FRONTEND</div>


        </div>
      </div>
      <div className="">
        <div className="relative mt-28 grid  grid-row-3 gap-10 justify-center">

          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3  text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  ADDRESS
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  PH NUMBER
                </th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-no-wrap text-center">{item._name}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-center">{item._address}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-center">{item._phNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>


    </div>
  )
}
