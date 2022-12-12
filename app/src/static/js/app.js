function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container className="d-flex flex-column">
            <ProductListCard />
        </Container>
    );
}

function ProductListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.code === item.code);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.code === item.code);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">You have no product yet! Add one above!</p>
            )} 
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.code}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [name,setName] = React.useState('');
    const [code,setCode] = React.useState('');
    const [quantity, setQuantity] = React.useState(0);

    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        // construct item
        const item = { 
            name: name,
            code: code,
            quantity: quantity
        }

        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setName('');
                setCode('');
                setQuantity(0);
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                    aria-describedby="basic-addon1"
                />
                <Form.Control
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    type="text"
                    placeholder="Code"
                    aria-describedby="basic-addon1"
                />
                <Form.Control
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    type="number"
                    placeholder="Quantity"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!code.length || !name.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button, Form, InputGroup } = ReactBootstrap;

    const [quantity, setQuantity] = React.useState(item.quantity);
    const [updating, setUpdating] = React.useState(false);

    const toggleUpdate = () => {
        setUpdating(true);
        fetch(`/items/${item.code}`, {
            method: 'PUT',
            body: JSON.stringify({
                quantity: quantity,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onItemUpdate(item);
                setUpdating(false);
            });
    };

    const removeItem = () => {
        fetch(`/items/${item.code}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid >
            <Row>
                <Col xs={10} className="name">
                <Form onSubmit={toggleUpdate}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            disabled="true"
                            type="text"
                            placeholder={item.code}
                            aria-describedby="basic-addon1"
                        />
                        <Form.Control
                            disabled="true"
                            type="text"
                            placeholder={item.name}
                            aria-describedby="basic-addon1"
                        />
                        <Form.Control
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            type="number"
                            placeholder={quantity}
                            aria-describedby="basic-addon1"
                        />
                        <InputGroup.Append>
                            <Button
                                type="submit"
                                variant="success"
                                className={updating ? 'disabled' : ''}
                            >
                                {updating ? 'Updating...' : 'Update'}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
