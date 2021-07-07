import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Divider,
    FormControl,
    ListItemIcon,
    MenuItem,
    Select,
    Tooltip,
    Typography,
    withStyles
} from "@material-ui/core";
import {ArrowDownwardOutlined, ArrowUpwardOutlined} from "@material-ui/icons";
import RemoveIcon from '@material-ui/icons/Remove';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortIcon from '@material-ui/icons/Sort';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

interface Props {
    resetQuery?: () => void;
    getQuery?: (query: string) => void;
}

const StyledBadge = withStyles(() => ({
    badge: {
        // top: '50%',
        // right: -3,
        fontSize: "0.85rem",
        border: "none",
        color: "grey"
        // The border color match the background color.
        // border: `2px solid ${
        //     theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
        // }`,
        // fontWeight: "bold",
    },
}))(Badge);

const MyMultiSort = (props: Props) => {

        const getQuery = (query: string) => props.getQuery;
        const resetQuery = () => props.resetQuery;

        const sortEnums = ["desc", "asc", "undefined"];

        const max = 3;

        const [MAXorder, setMAXorder] = useState(0);

        const [removedOrder, setRemovedOrder] = useState({
            id: undefined as unknown as number,
        });

        const [filterParams, setFilterParams] = useState('');

        const [params, setParams] = useState([
            {
                id: 1,
                columnName: "COUNT_CASH",
                translation: "Count Cash",
                sortEnum: sortEnums[2],
                clickCount: 2,
                order: 0
            },
            {
                id: 2,
                columnName: "COUNT_CREDIT",
                translation: "Count Credit",
                sortEnum: sortEnums[2],
                clickCount: 2,
                order: 0
            },
            {
                id: 3,
                columnName: "COUNT_TOTAL",
                translation: "Count Total",
                sortEnum: sortEnums[2],
                clickCount: 2,
                order: 0
            }
        ]);

        const handleSingleClick = (id: number, type?: string) => {
            // mouse event
            const newState = params.map(param => {
                if (type) {
                    if (type === "desc") {
                        if (param.id === id) {
                            return {
                                ...param,
                                sortEnum: sortEnums[0],
                                clickCount: 0,
                                order: 1
                            }
                        } else return {
                            ...param,
                            sortEnum: sortEnums[2],
                            clickCount: 2,
                            order: 0
                        }
                    } else if (param.id === id) {
                        return {
                            ...param,
                            sortEnum: sortEnums[1],
                            clickCount: 1,
                            order: 1
                        }
                    } else return {
                        ...param,
                        sortEnum: sortEnums[2],
                        clickCount: 2,
                        order: 0
                    }
                } else {
                    if (param.id === id) {
                        let newIndex = param.clickCount
                        if (param.clickCount < sortEnums.length - 1) {
                            newIndex += 1
                        } else {
                            newIndex = 0
                        }
                        return {
                            ...param,
                            clickCount: newIndex,
                            sortEnum: sortEnums[newIndex],
                            order: newIndex !== 2 ? 1 : 0
                        }
                    } else {
                        return {
                            ...param,
                            sortEnum: sortEnums[2],
                            order: 0,
                            clickCount: 2
                        }
                    }
                }
            })
            setParams(newState)
        };

        const handleCombinedClicks = (id: any, event: any) => {
            // mouse + Ctrl key
            if (event.type === "click" && event.ctrlKey === true) {
                const maxOrder = Math.max(...params.map(param => param.order))
                setMAXorder(maxOrder)

                const orderedState = params.map(
                    (param) => {
                        if (MAXorder === 0) {
                            if (param.id === id) {
                                let newIndex = param.clickCount
                                if (param.clickCount < sortEnums.length - 1) {
                                    newIndex += 1
                                } else {
                                    newIndex = 0
                                }
                                return {
                                    ...param,
                                    sortEnum: sortEnums[newIndex],
                                    clickCount: newIndex,
                                    order: 1
                                }
                            } else return param
                        } else if (MAXorder < max) {
                            if (param.id === id) {
                                let prevOrder = param.order
                                let newIndex = param.clickCount
                                if (param.clickCount < sortEnums.length - 1) {
                                    newIndex += 1
                                } else {
                                    newIndex = 0
                                }
                                if (newIndex === 2) {
                                    setRemovedOrder({id: param.id})
                                    return {
                                        ...param,
                                        sortEnum: sortEnums[newIndex],
                                        clickCount: newIndex,
                                        order: 0
                                    }
                                } else {
                                    return {
                                        ...param,
                                        sortEnum: sortEnums[newIndex],
                                        clickCount: newIndex,
                                        order: prevOrder === 0 ? MAXorder + 1 : prevOrder
                                    }
                                }
                            } else return param
                        } else if (param.id === id) {
                            let newIndex = param.clickCount
                            if (param.clickCount < sortEnums.length - 1) {
                                newIndex += 1
                            } else {
                                newIndex = 0
                            }
                            const prevOrder = param.order
                            if (sortEnums[newIndex] === "undefined" && prevOrder !== max) {
                                setRemovedOrder({id: param.id})
                            }
                            return {
                                ...param,
                                clickCount: newIndex,
                                sortEnum: sortEnums[newIndex],
                                order: sortEnums[newIndex] === "undefined" ? 0 : prevOrder
                            }
                        } else return param
                    }
                )
                setParams(orderedState)
            } else {
                handleSingleClick(id)
            }
        };

        const addToMultiSort = (index: number, id: number) => {
            const maxOrder = Math.max(...params.map(param => param.order))
            setMAXorder(maxOrder)
            const newState = params.map(param => {
                if (maxOrder === 0) {
                    if (param.id === id) {
                        if (index === 2) setRemovedOrder({id: param.id});
                        return {
                            ...param,
                            sortEnum: sortEnums[index],
                            clickCount: index,
                            order: index !== 2 ? 1 : 0
                        }
                    } else return param
                } else if (maxOrder < max) {
                    if (param.id === id) {
                        if (index === 2) {
                            setRemovedOrder({id: param.id})
                            return {
                                ...param,
                                sortEnum: sortEnums[index],
                                clickCount: index,
                                order: 0
                            }
                        } else {
                            let prevOrder = param.order
                            return {
                                ...param,
                                sortEnum: sortEnums[index],
                                clickCount: index,
                                order: prevOrder === 0 ? MAXorder + 1 : prevOrder
                            }
                        }
                    } else return param
                } else if (param.id === id) {
                    const prevOrder = param.order;
                    if (index === 2 && prevOrder !== max) setRemovedOrder({id: param.id});
                    return {
                        ...param,
                        sortEnum: sortEnums[index],
                        clickCount: index,
                        order: index !== 2 ? param.order : 0
                    }
                } else return param
            })
            setParams(newState)
        };

        const handleMenuClick = (index: unknown | string, id: number) => {
            switch (index) {
                case "desc":
                    handleSingleClick(id, index)
                    break;
                case "asc":
                    handleSingleClick(id, index)
                    break;
                case 0:
                    addToMultiSort(index, id)
                    break;
                case 1:
                    addToMultiSort(index, id)
                    break;
                case 2:
                    addToMultiSort(index, id)
                    break;
                default:
                    return
            }
        };

        const submitSortParams = () => {
            if (params.some(param => param.order !== 0)) {
                const sortedParams = params.filter(param => param.order !== 0).sort((a, b) => {
                    return a.order - b.order;
                });
                const query = sortedParams.map(param => `&sort=${param.columnName},${param.sortEnum}`).join("");
                setFilterParams(query);
                if (getQuery) {
                    getQuery(query)
                }
            }
        };

        const resetSortParams = () => {
            const resetParams = params.map(param => ({
                    id: param.id,
                    columnName: param.columnName,
                    translation: param.translation,
                    sortEnum: sortEnums[2],
                    clickCount: 2,
                    order: 0
                })
            );
            setParams(resetParams);
            setFilterParams('');
            if (resetQuery) {
                resetQuery()
            }
        };

        useEffect(() => {
            const maxOrder = Math.max(...params.map(param => param.order))
            setMAXorder(maxOrder)
        }, [params, removedOrder])

        useEffect(
            () => {
                if (removedOrder.id !== undefined) {
                    const myState = params.map(param => {
                        if (param.id !== removedOrder.id && param.order !== 1) {
                            let prevOrder = param.order
                            return {
                                ...param,
                                order: prevOrder - 1 <= 0 ? 0 : prevOrder - 1
                            }
                        } else return {
                            ...param
                        }
                    })
                    setParams(myState)
                }
            }
            , [removedOrder])

        return (
            <div style={{width: "100%"}}>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    padding: "5px",
                    backgroundColor: "whitesmoke"
                }}>
                    {
                        params.map((param) =>
                            <div key={param.id}
                                 style={{
                                     display: "flex",
                                     justifyContent: "center",
                                     alignItems: "center",
                                 }}>
                                <Button disableRipple
                                        disableFocusRipple
                                        fullWidth
                                        variant="text"
                                        color="default"
                                        style={{backgroundColor: "transparent", width: 135, padding: 0}}
                                        onClick={(event: any) => handleCombinedClicks(param.id, event)}>
                                    <Typography variant={"button"}>{param.translation}</Typography>
                                    {param.sortEnum === "desc" ?
                                        <StyledBadge badgeContent={MAXorder > 1 ? param.order : null} color="default">
                                            <ArrowDownwardOutlined style={{margin: 1, color: "grey"}} fontSize="small"/>
                                        </StyledBadge> : param.sortEnum === "asc" ?
                                            <StyledBadge badgeContent={MAXorder > 1 ? param.order : null} color="default">
                                                <ArrowUpwardOutlined style={{margin: 1, color: "grey"}} fontSize="small"/>
                                            </StyledBadge> : null}
                                </Button>
                                <FormControl variant="standard">
                                    <Select variant={"standard"}
                                            value=""
                                            onChange={(event) => handleMenuClick(event.target.value, param.id)}
                                            id={`${param.id}`}
                                            autoWidth={true}
                                            disableUnderline
                                            IconComponent={MoreVertIcon}>
                                        <MenuItem divider value={"desc"}>
                                            <ListItemIcon>
                                                <ArrowDownwardOutlined fontSize="small"/>
                                            </ListItemIcon>
                                            Sort desc
                                        </MenuItem>
                                        <MenuItem divider value={"asc"}>
                                            <ListItemIcon>
                                                <ArrowUpwardOutlined fontSize="small"/>
                                            </ListItemIcon>
                                            Sort asc
                                        </MenuItem>
                                        <MenuItem divider disabled={param.sortEnum === "desc"} value={0}>
                                            <ListItemIcon>
                                                <ArrowDownwardOutlined fontSize="small"/>
                                            </ListItemIcon>
                                            Add to sort desc
                                        </MenuItem>
                                        <MenuItem divider disabled={param.sortEnum === "asc"} value={1}>
                                            <ListItemIcon>
                                                <ArrowUpwardOutlined fontSize="small"/>
                                            </ListItemIcon>
                                            Add to sort asc
                                        </MenuItem>
                                        <MenuItem divider disabled={param.sortEnum === "undefined"} value={2}>
                                            <ListItemIcon>
                                                <RemoveIcon fontSize="small"/>
                                            </ListItemIcon>
                                            Unsort
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <Divider orientation="vertical" flexItem/>
                            </div>
                        )
                    }
                    <div>
                        <Tooltip title="Sort" arrow>
                            <Button style={{margin: 10, borderRadius: 15}} variant="outlined" size={"small"} color="primary"
                                    onClick={submitSortParams}>
                                <SortIcon/>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Unsort" arrow>
                            <Button style={{margin: 10, borderRadius: 15}} variant="outlined" size={"small"}
                                    color="secondary"
                                    onClick={resetSortParams}>
                                <RotateLeftIcon/>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                {filterParams !== '' && <h3>{filterParams}</h3>}
            </div>
        )
    }
;

export default MyMultiSort;