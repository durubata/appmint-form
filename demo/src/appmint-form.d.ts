declare module '@appmint/form' {
    export const AppmintForm: React.FC<{
        initData: any;
        schema: any;
        rules: any;
        theme: any;
        datatype: string;
        id: string;
        onChange?: (path: string, value: any, data: any, files: any, error: any) => void;
    }>;

    export const AppmintTable: React.FC<{
        title: any;
        rules: any;
        schema: any;
        datatype: string;
        description: any;
        id: string;
    }>;
}
