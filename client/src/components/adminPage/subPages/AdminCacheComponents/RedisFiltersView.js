import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react"
import { Container, Tabs, Tab, Button, Accordion, Row } from "react-bootstrap"
import { Context } from "../../../..";
import { fetchRedisKeys, getRedisFilters } from "../../../../http/adminAPI";
import { fetchTypes } from "../../../../http/typeAPI";
import RegenerateStorage from "../../../modals/RegenerateStorage";

let RedisFiltersView = () => {
    const [_filters, _setFilters] = useState([]);
    const [_showModal, _setShowModal] = useState(false);
    const { types } = useContext(Context);
    useEffect(() => {
        getRedisFilters().then(data => {
            data.data.sort((a, b)=>a[0]>b[0]);
            _setFilters(data.data);
        });
        console.log(types.types)
        if (types.types && types.types.length == 0) {
            fetchTypes().then(data => {
                types.setTypes(data);
            })
        }


    }, [])
    const _reload = () => {
        getRedisFilters().then(data => {
            data.data.sort((a, b)=>a[0]>b[0]);
            _setFilters(data.data);
        });
    }
    const _download=()=>{
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(JSON.stringify(_filters), 'filtersMap.json', 'text/plain');
    }
    const _copy = ()=>{
        navigator.clipboard.writeText(JSON.stringify(_filters)).then(()=>{
            alert("Copied")
        })
    }
    const _openModal=()=>{
        _setShowModal(true);
    }

    return (
        <Container>
            <Button onClick={_reload}>Update</Button>
            <Button onClick={_download}>Save json</Button>
            <Button onClick={_copy}>Copy json</Button>
            <Button onClick={_openModal}>Regenerate storage</Button>
            <RegenerateStorage show={_showModal} onHide={()=>{_setShowModal(false)}}/>
            <Accordion alwaysOpen>
                {_filters.map((e, i) =>
                    <Accordion.Item eventKey={i} key={'t' + e[0]}>
                        <Accordion.Header>ID:{e[0]}, NAME:{types.getTypeNameById(e[0])} </Accordion.Header>
                        <Accordion.Body>
                            {e.map((subEl, index) => {
                                return index== 0 ?'': <Row key={'e' + index}>{subEl}</Row>
                            })}
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
        </Container>
    )
}

export default observer(RedisFiltersView);