import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Context } from "..";
import { fetchTypes } from "../http/typeAPI";

const BreadcrumbPanel = ({ typeId, typeName, deviceName }) => {
    const [_typeName, _setTypeName] = useState(typeName ? typeName : '');
    const { types } = useContext(Context);
    useEffect(() => {
        if (typeId && !typeName) {
            if (types.types.length > 0) {
                let tmp = types.types.find(e => e.id == typeId)
                if (tmp) {
                    _setTypeName(tmp.name);
                }
                else {
                    _setTypeName("custom query");
                }
            }
            else {
                fetchTypes().then(data => {
                    types.setTypes(data);
                    let tmp = types.types.find(e => e.id == typeId)
                    if (tmp) {
                        _setTypeName(tmp.name);
                    }
                    else {
                        _setTypeName("custom query");
                    }
                })
            }
        }
    }, []);

    return (
        <Container>
            <Link to="/" style={{ textDecoration: 'none', color: '#1f618d' }}>SHOP NAME</Link>/
            {deviceName ? <Link to={"/devices/" + typeId} style={{ textDecoration: 'none', color: '#1f618d' }}>{_typeName}</Link> : <>{_typeName}</>}
            {deviceName ? ('/' + deviceName) : ''}
        </Container>
    );
}

export default observer(BreadcrumbPanel);