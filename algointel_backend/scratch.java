import org.springframework.web.util.DefaultUriBuilderFactory;

public class scratch {
    public static void main(String[] args) {
        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory("https://openrouter.ai/api/v1");
        System.out.println(factory.builder().path("/chat/completions").build().toString());
    }
}
