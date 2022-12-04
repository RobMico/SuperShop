import React, { useContext, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { Context } from "../../..";
import { fetchBrands } from "../../../http/brandAPI";
import CreateBrand from "../../modals/CreateBrand";
import AdminNav from "../AdminNav";
import BrandRow from "../BrandRow";

let AdminBrands = () => {
    const { brands } = useContext(Context);
    const [_brands, set_brands] = useState(null);
    
    const [brandVisible, setBrandVisible] =useState(false);
    const [brandBuffer, setBrandBuffer] = useState(null)    


    useEffect(() => {
        fetchBrands().then(data => {
            brands.setBrands(data);            
            set_brands(data)            
        });
    }, []);        
    return (
        <Container>
            <AdminNav />
            <CreateBrand show={brandVisible} onHide={()=>{setBrandVisible(false)}} edit={brandBuffer}/>
            {brands.brands.map(e => <BrandRow brand={e} brandBuffer={setBrandBuffer} showModal={setBrandVisible} key={e.id}/>)}
        </Container>
    )
}

export default AdminBrands;