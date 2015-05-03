files= Dir.entries(Dir.pwd).reject{|x| ['.','..','rename.rb'].include?(x)}

files.each do |old|
    
    new= old.sub(/[^\.]+\./, '').downcase.gsub('-','')
    File.rename(old,new)
end
