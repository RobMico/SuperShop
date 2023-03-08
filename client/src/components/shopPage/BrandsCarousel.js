import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardGroup, Container, ListGroup, Nav, Row, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import { fetchBrands, fetchCarouselBrands } from "../../http/brandAPI";
import getFullPath from "../../utils/FullFilePath";

const BrandsCarousel = observer(() => {
    console.info('Brands carousel render');
    const [_topBrands, _setTopBrands] = useState(null);
    const { filters } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCarouselBrands().then(data => {
            _setTopBrands(data);
        })
    }, []);

    const _navigateBrand = (brand)=>{
        filters.resetAll();
        filters.addBrand(brand.id);
        navigate('/devices/custom');
    };

    return (

        <>
            {_topBrands ? <CardGroup>
                {_topBrands.map(e =>
                    <Card style={{ width: '250px', cursor: 'pointer', marginTop: '5px', marginLeft: '5px' }} key={e.id} onClick={()=>{_navigateBrand(e)}}>
                        <Container style={{ padding: 0, margin: 0 }} className="text-center">
                            <Image width={150} height={150} src={e.img?getFullPath(e.img, 'brands/'):''} filter='grayscale(100%)' />
                        </Container>
                        <Container style={{textAlign: "center"}}>{e.name}</Container>
                    </Card>
                )}
            </CardGroup> : 'Loading...'}
        </>
    );
});

export default BrandsCarousel;