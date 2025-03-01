export interface ComponentConfig {
  id: string
  type: string
  props: Record<string, any>
  styles: Record<string, any>
  children?: ComponentConfig[]
}

export interface PageMetadata {
  layout: ComponentConfig[]
  settings?: {
    seo?: {
      title?: string
      description?: string
      keywords?: string[]
    }
    theme?: {
      background?: string
      textColor?: string
      spacing?: string
    }
  }
}

export type ComponentType = 
  | 'hero' 
  | 'features' 
  | 'productGrid' 
  | 'text' 
  | 'cta'
  | 'testimonials'
  | 'pricing'
  | 'contact'
  | 'gallery'
  | 'custom'

export interface BaseComponentProps {
  className?: string
  style?: Record<string, any>
  onUpdate?: (updates: Partial<ComponentConfig>) => void
}

export interface BaseComponentConfig {
  id: string;
  type: ComponentType;
  name: string;
  settings: Record<string, any>;
}

export interface ComponentStyles {
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  customCSS?: string;
}

export interface ComponentData extends BaseComponentConfig {
  styles: ComponentStyles;
  content: Record<string, any>;
  isHidden?: boolean;
  responsive?: {
    mobile?: Partial<ComponentStyles>;
    tablet?: Partial<ComponentStyles>;
    desktop?: Partial<ComponentStyles>;
  };
}

export interface PageLayout {
  components: ComponentData[];
  settings: {
    title: string;
    description?: string;
    slug: string;
    isPublished: boolean;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  };
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
  };
  spacing: {
    containerWidth: string;
    gap: string;
  };
  buttons: {
    borderRadius: string;
    primaryColor: string;
    secondaryColor: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export type EditorMode = 'edit' | 'preview' | 'code';

export interface EditorState {
  selectedComponent: string | null;
  mode: EditorMode;
  history: {
    past: ComponentData[][];
    present: ComponentData[];
    future: ComponentData[][];
  };
  isDragging: boolean;
  zoom: number;
} 