
import { useLocation, useParams, type Params } from 'react-router'
import { routesFn } from '../routes';
import type { ModuleHeaderPropsType, RouterItem } from '../helpers/types';


type useModuleHeaderType = [
    createPath?: string,
    filter?: boolean,
    importBtn?: boolean,
    moduleSingle?: string,
    showCreateBtn?: boolean,
    showViewSwitcher?: boolean
];

export const useModuleHeader = (): useModuleHeaderType => {
    const location = useLocation();
    const params = useParams();
    const { createPath, filter, importBtn, moduleSingle, showCreateBtn, showViewSwitcher } = findPathProps(location.pathname, params);
    return [createPath, filter, importBtn, moduleSingle, showCreateBtn, showViewSwitcher];
}

function findPathProps(pathKey: string, params: Readonly<Params<string>>) {
    const routes = routesFn().routerItems[0].children;

    const moduleKey = pathKey.split('/')[1];
    const moduleExt = pathKey.split('/')[2] || '';

    let props: ModuleHeaderPropsType = {};

    const id = params.id;

    routes?.map((item) => {

        if (item.path?.includes(moduleKey)) {
            const children = item.children;
            const createRoute = findCreatePath(children || []);


            if (children?.length) {
                children.some((child) => {

                    let match = child as RouterItem;
                    if (id) match.path = match.path?.replace(':id', id);

                    if (!moduleExt && child.index) {
                        if (match.headerProps) {
                            props = match.headerProps;
                            props.createPath = createRoute?.path;
                        }
                        return true;
                    } else if (moduleExt && pathKey?.includes(child.path ?? 'nada')) {
                        if (match.headerProps) {
                            props = match.headerProps;
                            props.createPath = createRoute?.path;
                        };
                        return true;
                    }
                    return false;
                });
            }
        }
    });


    return props;
}

function findCreatePath(children: RouterItem[]) {
    const location = useLocation();
    const moduleExt = location.pathname.split('/')[2] || '';
    const createPath = children.find((child) => child.path?.includes(moduleExt) && child.headerProps?.isCreate);
    return createPath;
}