// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

contract Contact{
    
    struct Hello{
        uint _id;
        string _name;
        string _address;
        uint _phNumber;
    }
    uint public totalContacts;
    mapping (uint => Hello) internal ContactDetails;

    event Log(uint indexed _id, string  _name, string  _address, uint _phNumber);

    function getContactDetails(uint _id) external view returns(  Hello memory){
        require(_id != 0,"0 is not a id");
        require(_id <= totalContacts,"this ID number doesn't exist");

        return ContactDetails[_id];
    }

    function setContactDetails(
        string memory _name,
        string memory _address,
        uint _phNumber
    ) external {
        uint val = totalContacts + 1;
        totalContacts = val;
        ContactDetails[val] = Hello(val, _name, _address, _phNumber);
        emit Log(val, _name, _address, _phNumber);
    }
}


//Sepolai:: 0x19eC099e65a03b1983f95B7DEB7b98b5ad3FA0c8
//Sepolai:: indexed:: 0xEdb29b2F164C2E188723E48c456dF10859C0A601
