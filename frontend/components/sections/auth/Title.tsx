import Typography from "@/components/ui/Typography";

const AuthTitle = ({title, subtitle} : {title: string, subtitle: string}) => {
    return ( 
        <div className="mb-8">
            <Typography variant={`title`} color={`gray_900`} className="font-bold">
                {title}
            </Typography>
            <Typography size={`base`}>
                {subtitle}
            </Typography>
        </div>
     );
}
 
export default AuthTitle;