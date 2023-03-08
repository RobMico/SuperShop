import React, { useEffect, useState } from "react"
import { Container, Button, Accordion } from "react-bootstrap"
import { clearRedisCache, fetchRedisKeys } from "../../../../http/adminAPI";

let RedisKeysView = () => {
    const [_filtersKeys, _setFiltersKeys] = useState([]);
    const [_cacheKeys, _setCacheKeys] = useState([]);
    useEffect(() => {
        fetchRedisKeys().then(e => {
            _setCacheKeys(e.data.filter(el => el.startsWith('*_')))
            e.data.sort(el => el.startsWith('typeD_'))
            e.data.sort(el => !el.startsWith('type_'))
            _setFiltersKeys(e.data.filter(el => !el.startsWith('*_')))
        })
    }, []);
    const _updateKeys = () => {
        fetchRedisKeys().then(e => {
            _setCacheKeys(e.data.filter(el => el.startsWith('*_')))
            e.data.sort(el => el.startsWith('typeD_'))
            e.data.sort(el => !el.startsWith('type_'))
            _setFiltersKeys(e.data.filter(el => !el.startsWith('*_')))
        });
    }

    const _clearCache = () => {
        clearRedisCache().then(e => {
            alert(e.data);
        })
    }
    return (
        <Container>
            <Button className="mr-1" onClick={_updateKeys}>Update</Button>
            <Button className="ml-1" onClick={_clearCache}>Clear cache</Button>
            <br/>
            <Accordion alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Filters count:{_filtersKeys.length}</Accordion.Header>
                    <Accordion.Body>
                        {_filtersKeys.map(e =>
                            <div key={e}>{e}</div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Cache keys count:{_cacheKeys.length}</Accordion.Header>
                    <Accordion.Body>
                        {_cacheKeys.map(e =>
                            <div key={e}>{e}</div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    )
}

export default RedisKeysView;