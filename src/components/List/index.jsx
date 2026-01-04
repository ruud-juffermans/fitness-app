import { FlatList, View } from 'react-native'
import Refresher from '../Refresher'
import { useCallback } from 'react';
import { H1 } from '../Typography';
import { useTheme } from "@theme/useTheme";

const List = ({ data, Item, EmptyState, title, source, ListHeaderComponent }) => {
    const { colors } = useTheme();
    const keyExtractor = useCallback((item) => String(item.id), []);
    const Header = ListHeaderComponent || <H1>{title}</H1>
    return (
        <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={Item}
            ListHeaderComponent={Header}
            ItemSeparatorComponent={() => <View style={{ paddingTop: 9 }} />}
            ListEmptyComponent={EmptyState}
            refreshControl={
                <Refresher isFetching={source.isFetching} refetch={source.refetch} />
            }
        />
    )
}

export default List