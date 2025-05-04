import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export default function NavigationProvider({ children }) {

    const navigate = useNavigate();

    return <NavigationContext.Provider value={navigate}>
        {children}
    </NavigationContext.Provider>
}

export function useNavigation() {
    return useContext(NavigationContext);
}