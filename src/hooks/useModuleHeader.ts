
import { useLocation } from 'react-router'
import { routesFn, type ModuleHeaderPropsType, type RouterItem } from '../routes';

type useModuleHeaderType = [
    createPath?: string,
    filter?: boolean,
    importBtn?: boolean,
    moduleSingle?: string
];

export const useModuleHeader = (): useModuleHeaderType => {
    const location = useLocation();
    const { createPath, filter, importBtn, moduleSingle } = findPathProps(location.pathname);
    return [createPath, filter, importBtn, moduleSingle];
}

function findPathProps(pathKey: string) {
    const routes = routesFn().routerItems[0].children;
    const moduleKey = pathKey.split('/')[1];
    const moduleExt = pathKey.split('/')[2] || '';

    let props: ModuleHeaderPropsType = {};

    routes?.map((item) => {
        if (item.path?.includes(moduleKey)) {
            const children = item.children;
            const route = findCreatePath(children || []);

            if (children?.length) {
                children.some((child) => {
                    const match = child as RouterItem;
                    if (!moduleExt && child.index) {
                        if (match.headerProps) {
                            props = match.headerProps;
                            props.createPath = route?.path;
                        }
                        return true;
                    } else if (moduleExt && child.path?.includes(pathKey)) {
                        if (match.headerProps) {
                            props = match.headerProps;
                            props.createPath = route?.path;
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
    const createPath = children.find((child) => child.headerProps?.isCreate)
    return createPath;
}