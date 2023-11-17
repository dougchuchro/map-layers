export default function StoresList({ stores, brandsMap }) {
    const brandIds = [];
    brandsMap.forEach((brand, key, map) => {
        if (brand.display) {
            brandIds.push(key)
        }
    });

    const filteredStores = stores.filter(store =>
        brandIds.some((id) => id === store.properties.BRAND_CODE)
    );

    return <ul>
        {filteredStores.map(store =>
            <li key={store.properties.STORE_NUM}>
                <p>
                    <b>{store.properties.BRAND}:</b>
                    {' ' + store.properties.STORE_NAME + ' '}
                </p>
            </li>
        )}
    </ul>
}