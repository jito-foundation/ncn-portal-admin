import { useContext } from "react";
import { UseThemeProps } from "./interface";
import { ThemeContext } from "./ThemeContext";

/* eslint-disable @typescript-eslint/no-unused-vars */
const defaultContext: UseThemeProps = { setTheme: (_) => {}, themes: [] };

export const useTheme = () => useContext(ThemeContext) ?? defaultContext;